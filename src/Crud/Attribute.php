<?php
namespace Sandbox\Cms\Crud;

use Sandbox\Cms\Crud\InputFields\InputFieldInterface;
use Sandbox\Cms\Crud\InputFields\TextBox;

class Attribute
{
    public $name;
    public $nameOriginal;
    public $isPrimaryKey = false;
    public $label;
    public $value;
    public $model;

    protected $fieldType;
    protected $customValue;
    protected $customSavingData;
    protected $crud;

    public $fromRelation = false;
    public $relation = null;

    public function __construct($name)
    {
        $this->name = $name;
        $this->nameOriginal = $name;
        $this->label = str_replace('_', ' ', ucfirst($name));

        $this->fieldType = new TextBox();

        return $this;
    }

    static public function key($name)
    {
        return new self($name);
    }

    public function withRelation($relation)
    {
        $this->fromRelation = true;
        $this->relation = $relation;
        $this->name = '__' . $this->name;
        return $this;
    }

    public function isPrimaryKey($isPrimaryKey)
    {
        $this->isPrimaryKey = $isPrimaryKey;
        return $this;
    }

    public function label($label)
    {
        $this->label = $label;

        return $this;
    }

    public function customFieldType(InputFieldInterface $field) {
        $this->fieldType = $field;

        $field->setAttribute($this);

        if ($this->crud) {
            $field->setCrud($this->crud);
        }

        return $this;
    }

    public function field(InputFieldInterface $field) {
        $this->customFieldType($field);

        return $this;
    }

    public function fieldType()
    {
        return $this->fieldType;
    }

    public function renderField()
    {
        return $this->fieldType()->render(str_replace('.', '_', $this->name), $this->value);
    }

    public function value($model)
    {
        $this->model = $model;
        if($this->fromRelation){
            foreach(explode('.', $this->nameOriginal) as $value) {
                $model = $model->{$value};
            }
            $this->value = $model;
        }else {
            $this->value = $model->{$this->nameOriginal};
        }


        return $this;
    }

    public function customValue(callable $callback)
    {
        $this->customValue = $callback;

        return $this;
    }

    public function getClientValue()
    {
        if($this->customValue){
            return call_user_func($this->customValue, $this->nameOriginal, $this->value, $this->model);
        }

        return $this->value;
    }

    public function getSavingData($value)
    {
        if($this->customSavingData){
            return call_user_func($this->customSavingData, $value);
        }

        return $value;
    }

    public function customSavingData(callable $callback)
    {
        $this->customSavingData = $callback;

        return $this;
    }

    public function setCrud(Crud $crud)
    {
        $this->crud = $crud;

        if ($this->fieldType) {
            $this->fieldType->setCrud($this->crud);
        }
    }
}