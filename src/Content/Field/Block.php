<?php
namespace Sandbox\Content\Field;

class Block extends AbstractField
{
	private $_elements;
	
	function __construct($xmlNode) {
		parent::__construct ($xmlNode);
		
		$this->_elements = array ();
		
		if ($xmlNode->children ()) {
			foreach ($xmlNode->children () as $xmlField) {
				$id = (string)$xmlField->attributes()->id;
				$type = (string)$xmlField->getName();				
				
				$this->addElement ($type, $id, $xmlField);
			}
		}
	}
	
	function __get($name)
	{
		if ($name == 'type')
			return $this->_type;
		elseif ($name == 'id')
			return $this->_id;
		elseif (isset($this->_elements[$name]))
			return $this->_elements[$name];
		else
			return null;
	}
	
	function __toString()
	{
		return 'Block does not return a string. <br />Try accessing a child: '.implode (',',array_keys($this->_elements));
	}
	
	public function addElement ($type, $id, $xml)
	{
		$elementClassName = "".ucfirst($type);
		$element = new $elementClassName ($xml);
		
		$this->_elements[$id] = $element;
	}
	
	public function getElement ($id)
	{
		if (array_key_exists($id, $this->_elements)) {
            return $this->_elements[$id];
        }
        return null;
	}
	
	public function hasContent ($elementId)
	{
		$element = $this->getElement($elementId);
		
		if (!isset($element))
			return false;
			
		if ($element->hasContent())
			return true;
		else
			return false;
	}
}