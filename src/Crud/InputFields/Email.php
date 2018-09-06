<?php

namespace Sandbox\Cms\Crud\InputFields;

class Email extends AbstractInputField {

    use InputField;

    public function render($name, $data = null) {
        return "<input name='$name' type='email' class='cms-text' value='$data'>";
    }
}