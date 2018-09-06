<?php
namespace Sandbox\Cms\Content\Field;

class Custom extends AbstractField
{		
	function __construct(\SimpleXMLElement $xmlNode)
	{
		parent::__construct ($xmlNode);
		
		$this->_value = (string)$xmlNode;
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