<?php

namespace Sandbox\Cms\Crud\InputFields;

class TextBox extends AbstractInputField {

    use InputField;

    public function render($name, $data = null) {
        $data = htmlentities($data,ENT_QUOTES);
        return "<input name='$name' type='text' class='cms-text' value='$data'>";
    }
}