<?php

namespace Sandbox\Cms\Crud\InputFields;

class CheckBoxes extends AbstractInputField {

    use InputField;
    use withOptions;

    public function render($name, $data = null) {
        $data = explode(',', $data);


        $field = "<div class='mb-3'>";
        foreach ($this->options as $key => $value){
            $checked = (in_array($key,$data)) ? 'checked' : '';

            $field .= "<div class='form-check'>";
            $field .= "  <input name='" . $name . "[]' class='form-check-input' type='checkbox' id='$name-$key' value='$key' $checked>";
            $field .= "  <label class='form-check-label' for='$name-$key'>$value</label>";
            $field .= "</div>";
        }
        $field .= "</div>";

        return $field;
    }
}