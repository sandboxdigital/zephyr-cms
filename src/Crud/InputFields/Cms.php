<?php

namespace Sandbox\Cms\Crud\InputFields;


class Cms extends AbstractInputField
{
    use InputField;
    use withOptions;

    public function render($name, $data = null) {

        $model = $this->crud->modelInstance;
        if(!isset($this->options['content_template_id']) || !isset($this->options['link_type'])){
            throw new \Exception('Options content_template_id and link_type is required for InputFields\Cms');
            return;
        }

        $contentTemplateId = $this->options['content_template_id'];
        $linkType = $this->options['link_type'];


        if ($model) {
            return '<cms-content-form data-content-template-id="'. $contentTemplateId .'" data-link-id="' . $model->id . '" data-link-type="'. $linkType .'" data-hide-save="true"></cms-content-form>';
        } else {
            return '';

        }
    }
}