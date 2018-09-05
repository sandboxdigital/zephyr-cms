<?php
namespace Sandbox\Content\Field;

class Html extends AbstractField
{

    function __construct($elementSpec) {
        parent::__construct ($elementSpec);
    }
	
	function __toString () 
	{
		return $this->_value;
	}
}