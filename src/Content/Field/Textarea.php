<?php
namespace Sandbox\Content\Field;

class Textarea extends AbstractField
{
    function __construct($elementSpec) {
        parent::__construct ($elementSpec);
    }
	
	function __toString () 
	{
		return $this->_value;
	}
	
	function toString () 
	{
		return $this->__toString();
	}
	
	function fromPost ()
	{
		
	}
}