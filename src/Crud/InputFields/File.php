<?php

namespace Sandbox\Cms\Crud\InputFields;

class File extends AbstractInputField {

    use InputField;
    public function render($name, $data = null) {
        return "<input name='$name' type='file' class='form-control-file' value='$data'>";
    }
}