<?php

namespace Sandbox\Cms\Crud\InputFields;

use Carbon\Carbon;

class Date extends AbstractInputField {

    use InputField;

    public function render($name, $data = null) {
        if($data instanceof Carbon){
            $data = $data->format('Y-m-d');
        }

        return "<input name='$name' type='date' class='cms-text bg-white' value='$data'>";
    }
}