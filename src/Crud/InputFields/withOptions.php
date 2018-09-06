<?php
namespace Sandbox\Cms\Crud\InputFields;

Trait withOptions
{
    protected $options = [];

    /**
     * @param $options
     * @return $this
     */
    public function options($options)
    {
        $this->options = $options;

        return $this;
    }
}