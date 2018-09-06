<?php

namespace Sandbox\Cms\Crud\InputFields;

class Select extends AbstractInputField {

    use InputField;
    use withOptions;

    public function render($name, $data = null) {
        $field = "<div class='cms-select-c'><select name='$name' class='cms-select'>";
        foreach ($this->options as $key => $value){
            $selected = ($key == $data) ? 'selected' : '';
            $field .= "<option value='$key' $selected>$value</option>";
        }
        $field .= "</select></div>";

        return $field;
    }
}