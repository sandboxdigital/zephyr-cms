<?php

namespace Sandbox\Cms\Crud\InputFields;


class ChosenSelect extends AbstractInputField {

    use InputField;
    use withOptions;

    public function render($name, $data = null) {
        $field = "<chosen-select name='$name'>";
        foreach ($this->options as $key => $value){
            $selected = ($key === $data) ? 'selected' : '';
            $field .= "<option value='$key' $selected>$value</option>";
        }
        $field .= "</chosen-select>";

        return $field;
    }
}