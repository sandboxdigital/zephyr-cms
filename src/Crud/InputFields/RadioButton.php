<?php

namespace Sandbox\Cms\Crud\InputFields;

class RadioButton extends AbstractInputField {

    use InputField;
    use withOptions;

    public function render($name, $data = null) {
        $field = '';
        foreach ($this->options as $key => $value){
            $checked = ($key == $data) ? 'checked' : '';

            $field .= '<div class="form-check">';
            $field .= "<input type='radio' name='$name' value='$key' class='form-check-input' id='$name-$key' $checked>";
            $field .= "<label class='form-check-label' for='$name-$key'>$value</label>";
            $field .= '</div>';
        }

        return $field;
    }
}