<?php
namespace Sandbox\Cms\Crud;

use Sandbox\Cms\Crud\Filters\FilterInterface;
use Sandbox\Cms\Crud\InputFields\InputFieldInterface;
use phpDocumentor\Reflection\Types\Self_;

class CrudService {

    public static function getField($name, InputFieldInterface $inputField, $data = null, $option = []){
        return $inputField->render($name, $data, $option);
    }

    public static function getFilter($name, $label,  FilterInterface $filter, $data = null, $option = []){
        return $filter->render($name, $label, $data, $option);
    }
}