<?php

namespace Sandbox\Cms\Crud\InputFields;


class Cms extends AbstractInputField
{
    use InputField;

    public function render($name, $data = null) {

        $model = $this->crud->modelInstance;

        if ($model) {
            return '<cms-content-form data-content-template-id="2" data-link-id="' . $model->id . '" data-link-type="BLOG" data-hide-save="true"></cms-content-form>';
        } else {
            return '';

        }
    }
}