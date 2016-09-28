<?php
namespace SandboxDigital\Cms\Field;

class PlaceholderField extends AbstractField
{
	var $_name;

	public function __construct($name)
	{
		$this->_name = $name;
	}

	public function __get($name)
	{
		return new PlaceholderField($this->_name.'->'.$name);
	}

	public function __toString()
	{
	    return '';
	}

	public function getFile ()
	{
		return null;
	}

	public function hasContent ()
	{
		return false;
	}

	public function toJson ()
	{
		return '{type:"placeholder",id:"placeholder"}';
	}
}
