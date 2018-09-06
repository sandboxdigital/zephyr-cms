<?php
namespace Sandbox\Cms\Crud\Traits;

use Sandbox\Cms\Crud\Attribute;
use Sandbox\Cms\Crud\Crud;
use Sandbox\Cms\Crud\InputFields\DateTime;
use Sandbox\Cms\Crud\InputFields\Number;
use Sandbox\Cms\Crud\InputFields\RadioButton;
use Sandbox\Cms\Crud\InputFields\Text;
use Sandbox\Cms\Crud\InputFields\TextArea;
use Sandbox\Cms\Crud\InputFields\TextBox;
use Sandbox\Cms\Crud\InputFields\Time;
use Illuminate\Support\Facades\DB;

Trait CrudAttributesManager {

    public $attributes = [];
    public $attributesList = [];
    public $attributesEdit = [];
    public $attributesCreate = [];
    public $withRelation = false;

    public function updateAttribute($attribute, $type)
    {
        $this->attributes[$attribute] = $type;
    }
    public function addAttribute($attribute)
    {
        if (is_string($attribute)) {
            $attribute = Attribute::key($attribute);
        }
        if (!$attribute instanceof Attribute){
            return null;
        }

        $attribute->setCrud($this);

        if($attribute->fromRelation){
            return $this->attributes[$attribute->name] = $attribute;
        }else {
            return $this->attributes[$attribute->name] = $attribute;
        }
    }

    /**
     * @param array $attributes array of attributes
     * @return Crud
     */
    public function addAttributes($attributes = [])
    {
        foreach ($attributes as $attribute){
            $this->addAttribute($attribute);
        }

        return $this;
    }



    /**
     * @param $key
     * @return mixed|null
     */
    public function getAttribute($key, $attribute = null)
    {
        if (isset($this->attributes[$key])) {
            return $this->attributes[$key];
        }

        return null;
    }

    protected function getColumns()
    {
        $this->attributesList = $this->attributes;
        $this->attributesEdit = $this->attributes;
        $this->attributesCreate = $this->attributes;

        $this->hiddenFromCreate(['id']);
    }

    /**
     * Sets default Input Fields of given attributes and Adds Attributes
     *
     * @param $attributes
     */
    public function setDefaultFieldsFromAttributes($attributes) {
        $attr = $this->setDefaultFields($attributes);
        $this->addAttributes($attr);
    }

    /**sale
     * Sets default Input Fields of given attributes
     *
     * @param $attributes
     * @return array array of attributes
     */
    protected function setDefaultFields($attributes) {
        $attr = [];
        foreach($attributes as $attribute){
            if($attribute == 'id'){
                $attr[] = Attribute::key($attribute)->isPrimaryKey(true)->customFieldType(Text::set());
            }else {
                try {
                    $attrType = DB::connection()->getDoctrineColumn($this->tableName, $attribute)->getType()->getName();
                } catch (\Exception $e) {
                    $attrType = null;
                }

                switch ($attrType) {
                    case 'integer' :
                        $attr[] = Attribute::key($attribute)->customFieldType(Number::set());
                        break;
                    case 'boolean' :
                        Attribute::key($attribute)->customFieldType(RadioButton::set()->options([
                            1 => 'Yes',
                            0 => 'no'
                        ]));
                        break;
                    case 'text' :
                        $attr[] = Attribute::key($attribute)->customFieldType(Textarea::set());
                        break;
                    case 'time' :
                        $attr[] = Attribute::key($attribute)->customFieldType(Time::set())->customSavingData(function($value){
                            return $value ? $value : null;
                        });
                        break;
                    case 'datetime' :
                        $attr[] = Attribute::key($attribute)->customFieldType(DateTime::set());
                        break;
                    default :
                        $attr[] = Attribute::key($attribute)->customFieldType(TextBox::set());
                        break;
                }
            }
        }
        return $attr;
    }

    /**
     * Uses model's fillable properties as attributes. also uses default Input Fields
     *
     * @param null $table
     * @return $this
     */
    public function addDefaultFieldFromFillable(){
        $defaultAttribute = ['id'];

        $model = new $this->model;
        $fillable = $model->getFillable();

        $attributesKeys = array_unique(array_merge($defaultAttribute, $fillable));

        $attributes = $this->setDefaultFields($attributesKeys);

        $this->addAttributes($attributes);

        return $this;
    }


    /* Attributes */
    public function hideAttribute($attributes)
    {
        foreach( $attributes as $attribute) {
            $index = array_search( $attribute );
            if($index) {
                $this->attributes = array_splice($this->attributes, $index, 1);
            }
        }
    }

    public function hiddenFromList($attributes)
    {
        $this->attributesList = array_values(array_diff(array_keys($this->attributes), $attributes));
    }

    public function visibleFromList($attributes)
    {
        $this->attributesList = array_values(array_intersect(array_keys($this->attributes), $attributes));
    }

    public function hiddenFromEdit($attributes)
    {
        $this->attributesEdit = array_values(array_diff(array_keys($this->attributes), $attributes));
    }

    public function visibleFromEdit($attributes)
    {
        $this->attributesEdit = array_values(array_intersect(array_keys($this->attributes), $attributes));
    }

    public function hiddenFromCreate($attributes)
    {
        $this->attributesCreate = array_values(array_diff(array_keys($this->attributes), $attributes));
    }

    public function visibleFromCreate($attributes)
    {
        $this->attributesCreate = array_values(array_intersect(array_keys($this->attributes), $attributes));
    }
}