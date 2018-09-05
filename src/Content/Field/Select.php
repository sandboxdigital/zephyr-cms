<?php
namespace Sandbox\Content\Field;

class Select extends AbstractField
{

    function __construct($elementSpec) {
        parent::__construct ($elementSpec);
    }
	
	function __toString () 
	{
		return $this->_value;
	}
	
	function fromPost ()
	{
		
	}
}