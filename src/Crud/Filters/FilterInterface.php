<?php

namespace Sandbox\Cms\Crud\Filters;

interface FilterInterface {
    public function render($name, $label, $data = null, $options = []);
    public function execute($query, $attribute, $value);
}