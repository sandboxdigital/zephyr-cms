<?php

namespace Sandbox\Cms\Crud\InputFields;


use Sandbox\Cms\Crud\Attribute;
use Sandbox\Cms\Crud\Crud;

abstract class AbstractInputField implements InputFieldInterface
{
    /** @var Attribute */
    public $attribute;

    /** @var Crud */
    public $crud;

    public function setAttribute(Attribute $attribute)
    {
        $this->attribute = $attribute;
    }

    public function setCrud(Crud $crud)
    {
        $this->crud = $crud;
    }
}