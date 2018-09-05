<?php
namespace Sandbox\Content\Field;

use Carbon\Carbon;

class Date extends AbstractField
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

    /**
     * @return Carbon
     */
    function toDate ()
    {
        return new Carbon(strtotime($this->_value));
    }
	
	function fromPost ()
	{
		
	}
}