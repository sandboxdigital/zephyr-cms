<?php
namespace Sandbox\Cms\Crud\InputFields;

Trait InputField
{
    /**
     * @return InputField
     */
    static public function set()
    {
        return new self();
    }
}