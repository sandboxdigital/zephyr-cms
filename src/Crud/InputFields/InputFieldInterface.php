<?php
namespace Sandbox\Cms\Crud\InputFields;

use Sandbox\Cms\Crud\Attribute;
use Sandbox\Cms\Crud\Crud;

interface InputFieldInterface{

    public function render($name, $data = null);

    public function setCrud(Crud $crud);

    public function setAttribute(Attribute $attribute);
}