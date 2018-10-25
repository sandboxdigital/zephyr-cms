<?php
namespace Sandbox\Cms\Crud;

use Sandbox\Cms\Crud\Filters\FilterInterface;
use Sandbox\Cms\Crud\InputFields\InputFieldInterface;
use Sandbox\Cms\Crud\InputFields\Number;
use Sandbox\Cms\Crud\InputFields\RadioButton;
use Sandbox\Cms\Crud\InputFields\Text;
use Sandbox\Cms\Crud\InputFields\TextArea;
use Sandbox\Cms\Crud\InputFields\TextBox;
use Sandbox\Cms\Crud\Traits\CrudAttributesManager;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Sandbox\Cms\Crud\Attribute;

class Crud
{

    use CrudAttributesManager;

    public $model;
    public $modelInstance;

    protected $query;
    protected $customQuery;

    public $tableName;
    public $tableLabel;
    public $routeName;

    public $attributesWithFieldTypes = [];
    public $fieldTypes = [];

    public $filters = [];
    public $activeFilters = [];

    public $enableStore;
    public $enableUpdate;
    public $enableDelete;

    public $enableFileUploads;
    public $uploadSavePath;

    public $customEditHeadView;


    /**
     * Crud constructor.
     * @param $model = Model Class
     */
    public function __construct($model)
    {
        $this->setupProperties($model);
    }

    /**
     * @param callable $callback should return $query
     */
    public function customQuery(callable $callback) {
        $this->customQuery = $callback;
    }

    /**
     * @param Model $model
     */
    protected function setupProperties($model) {
        $this->model = $model;
        $newModel = new $model;
        $this->tableName = $this->routeName = $newModel->getTable();;

        $this->tableLabel = ucfirst($this->tableName);

        $this->enableStore = $this->enableUpdate = $this->enableDelete = true;

        $this->enableFileUploads = false;

        $this->customEditHeadView = null;
    }

    /**
     * @param string|Attribute $attribute
     * @return Attribute $attribute
     */

    public function getLists()
    {
        $query = $this->model::query();
        if($this->customQuery){
            $query = call_user_func($this->customQuery, $query);
        }
        foreach($this->activeFilters as $attribute => $value){
            if(isset($this->filters[$attribute])){
                $filter = $this->filters[$attribute]['type'];
                $query = $filter->execute($query, $attribute, $value);
            }
        }

        if( in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses($this->model))){
            $query = $query->whereNull('deleted_at');
        }

        return $query->paginate(100);
    }

    public function getModelInstance($id)
    {
        $this->modelInstance = $this->model::find($id);
        return $this->modelInstance;
    }


    public function addFilter($name, $label, FilterInterface $type, $option = [])
    {
        $filter = [
            'type' => $type,
            'label' => $label,
            'option' => $option
        ];

        $this->filters[$name] = $filter;
    }

    /* Queries Builders */
    public function updateModel($id, $data)
    {

        $relationShips = [];

        $model = $this->model::findOrFail($id);
        foreach($this->attributes as $key => $attribute){
            if($attribute->isPrimaryKey){
                continue;
            }

            if($attribute->fromRelation) {

                /* Only works with single level nested model (relation) */
                $modelKeys = explode('.', $attribute->name);
                $key = str_replace('.', '_', $key);
                $relation = $attribute->relation;

                if(!in_array($relation, $relationShips)){
                    $relationShips[] = $relation;
                }

                $model->{$relation}->{$modelKeys[1]} = $attribute->getSavingData($data[$key]);
            }else {
                if(isset($data[$key])){
                    $model->{$key} = $attribute->getSavingData($data[$key]);
                }
            }
        }

        foreach($relationShips as $relation) {
            $model->{$relation}->save();
        }

        return $model->save();
    }

    public function storeModel($data)
    {
        $model = new $this->model;
        return $model->fill($data)->save();
    }

    public function destroyModel($id)
    {
        $model = $this->model::findOrFail($id);
        return $model->delete();
    }

}