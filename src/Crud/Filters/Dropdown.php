<?php
namespace Sandbox\Cms\Crud\Filters;

class Dropdown implements FilterInterface {

    public function render($name,$label, $data = null, $options = [])
    {
        $template = '<div class="d-inline-block">';
        $template .= "<label class='ml-1 mr-3'>$label</label>";
        $template .= "<div class='cms-select-c' style='display: inline-block'><select name='$name' class='cms-select'>";
        $template .= "<option value=''>All</option>";
        foreach ($options as $key => $value){
            $selected =  ((string)$key === (string)$data) ? 'selected' : '';
            $template .= "<option value='$key' $selected>$value</option>";
        }
        $template .= "</select></div></div>";

        return $template;
    }

    public function execute($query, $attribute, $value)
    {
        if(!empty($value) || (string)$value === "0"){
            return $query->where($attribute, $value);
        }
        return $query;
    }
}
