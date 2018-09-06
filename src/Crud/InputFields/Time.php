<?php

namespace Sandbox\Cms\Crud\InputFields;

use Carbon\Carbon;

class Time extends AbstractInputField {

    use InputField;

    public function render($name, $data = null) {
        if($data instanceof Carbon){
            $data = $data->format('h:i:s');
        }

        return "<input name='$name' type='time' class='cms-text bg-white' value='$data'>";
    }
}