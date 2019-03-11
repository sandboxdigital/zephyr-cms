<?php

namespace Sandbox\Cms\Crud\InputFields;

class RichEditor extends AbstractInputField
{
    use InputField;

    public function render($name, $data = null) {
        //return "<ssr-editor name='$name'>$data</ssr-editor>";
        $data = htmlentities($data);
        return "<rich-text-editor name=\"$name\" initial-content=\"$data\"></rich-text-editor>";
        //return "<ssr-editor name=\"$name\" initial-content=\"$data\"></ssr-editor>";
    }
}