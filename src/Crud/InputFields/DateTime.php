<?php

namespace Sandbox\Cms\Crud\InputFields;

use Carbon\Carbon;

class DateTime extends AbstractInputField {

    use InputField;

    public function render($name, $data = null) {
        if($data instanceof Carbon){
            $data = $data->format('Y-m-d\TH:i');
        }

        return "<input name='$name' type='datetime-local' class='cms-text' value='$data'>";
    }
}