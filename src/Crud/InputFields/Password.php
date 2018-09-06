<?php

namespace Sandbox\Cms\Crud\InputFields;

class Password extends AbstractInputField {

    use InputField;

    public function render($name, $data = null) {
        return "<input name='$name' type='password' class='cms-text'>";
    }
}