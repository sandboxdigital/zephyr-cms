<?php
/**
 * Created by PhpStorm.
 * User: jesign
 * Date: 7/28/18
 * Time: 1:15 AM
 */

namespace Sandbox\Cms\Crud\InputFields;


class Hidden extends AbstractInputField {

    use InputField;

    public function render($name, $data = null) {
        return "<input type='hidden' name='$name' value='$data'>";
    }
}