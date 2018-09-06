<?php
namespace Sandbox\Cms\Crud\Filters;

class SearchBox implements FilterInterface {
    public function render($name,$label, $data = null, $options = [])
    {
        $template = '<div class="d-inline-block">';
        $template .= "<label class='ml-1 mr-3'>$label</label>";
        $template .= "<input type='text' name='$name' value='$data' placeholder='Search' class='form-control'>";
        $template .= "</div>";

        return $template;
    }

    public function execute($query, $attribute, $value)
    {
        if(!$value){
            return $query;
        }
        return $query->where($attribute,'like', '%'.$value.'%');
    }
}
