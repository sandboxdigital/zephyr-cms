<?php

namespace Sandbox\Cms\Crud\InputFields;

class CheckBox extends AbstractInputField {

    use InputField;
    use withOptions;

    /**
     * @param $name
     * @param $data
     * @return string
     *
     * options default values can be seen at line 18-20
     */
    public function render($name, $data = null) {
        $label = isset($this->options['label']) ? $this->options['label'] : "";
        $value = isset($this->options['value']) ? $this->options['value'] : "1";
        $default = isset($this->options['default']) ? $this->options['default'] : "0";


        $field = "<div class='mt-2 mb-1'>";

        $checked = $value == $data ? 'checked' : '';

        $field .= "<div class='form-check'>";
        $field .= "  <input name='" . $name . "' class='form-check-input' type='hidden' value='$default'>";
        $field .= "  <input name='" . $name . "' class='form-check-input' type='checkbox' id='$name' value='$value' $checked>";
        $field .= "  <label class='form-check-label' for='$name'>$label</label>";
        $field .= "</div>";

        $field .= "</div>";

        return $field;
    }
}