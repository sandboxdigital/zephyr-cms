<?php

namespace Sandbox\Cms\Crud\InputFields;


/*
 * Note this class is for display purposes only
 *
 * */

class TextArea extends AbstractInputField {

    use InputField;

    public function render($name, $data = null) {
        return "<textarea name='$name' type='text' class='cms-text' rows='5'>$data</textarea>";
    }
}