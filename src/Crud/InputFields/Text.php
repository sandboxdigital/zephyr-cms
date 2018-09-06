<?php

namespace Sandbox\Cms\Crud\InputFields;


/*
 * Note this class is for display purposes only
 *
 * */

class Text extends AbstractInputField {

    use InputField;

    public function render($name, $data = null) {
        return "<h4 class='d-inline-block'>$data</h4><input type='hidden' name='$name' value='$data'>";
    }
}