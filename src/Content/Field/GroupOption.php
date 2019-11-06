<?php
namespace Sandbox\Cms\Content\Field;

class GroupOption extends AbstractField
{
	private $_elements;
	
	function __construct($xmlNode = null) {
		parent::__construct ($xmlNode);
//        $this->loadXml($xmlNode);
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
			return parent::__get($name);
	}
	
	function __toString()
	{
	    $keys = implode (',',array_keys($this->_elements));
	    $id = $this->_id;
		return "GroupOption does not return a string. <br />
  - id: $id <br /> 
  - blocks: $keys <br /><br />";
	}

	public function toJson ()
	{
		$jsonElements = array ();
		foreach ($this->_elements as $key=>$value)
		{
			$j = $this->_elements[$key]->toJson ();
			array_push($jsonElements,$key.':'.$j);
		}

		$jA = implode(',',$jsonElements);

		return '{"type":"'.$this->_type.'","id":"'.$this->_id.'","uid":"'.$this->_uid.'","label":"'.$this->_label.'","elements":{'.implode(',',$jsonElements).'}}';
	}
	
	public function addElement ($type, $id, $xml)
	{
		// TODO - move to adapter
        $elementClassName = "Sandbox\\Cms\\Content\\Field\\".ucfirst($type);
        $element = new $elementClassName ($xml);

        $this->_elements[$id] = $element;

        return $element;
	}
	
	public function get ($id)
	{
		if (array_key_exists($id, $this->_elements)) {
            return $this->_elements[$id];
        }
        return null;
	}

	public function loadJson($json)
    {
        parent::loadJson($json);

//        dd($json);

        foreach($json->data as $elementJson)
        {
            if (isset($elementJson->type)) {
                $type = $elementJson->type;
                $this->addElement($type, $elementJson->id, $elementJson);
            } else {
                dd($elementJson);
            }
        }
    }

    /**
     * @param \SimpleXMLElement $xmlNode
     */
    public function loadXml(\SimpleXMLElement $xmlNode): void
    {
        $this->_elements = array();

        if ($xmlNode->children()) {
            foreach ($xmlNode->children() as $xmlField) {
                $id = (string)$xmlField->attributes()->id;
                $type = (string)$xmlField->getName();

                $this->addElement($type, $id, $xmlField);
            }
        }
    }
}