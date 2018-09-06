<?php

namespace Sandbox\Cms\Crud\InputFields;

class TextBox extends AbstractInputField {

    use InputField;

    public function render($name, $data = null) {
        return "<input name='$name' type='text' class='cms-text' value='$data'>";
    }
}