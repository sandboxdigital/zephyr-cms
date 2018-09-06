<?php

namespace Sandbox\Cms\Crud\InputFields;

class Number extends AbstractInputField {

    use InputField;

    public function render($name, $data = null) {
        return "<input name='$name' type='number' class='cms-text' value='$data'>";
    }
}