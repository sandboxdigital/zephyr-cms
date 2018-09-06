<?php
namespace Sandbox\Cms\Content\Field;

class AbstractField {
	protected $_type;
	protected $_id;
	protected $_uid;
	protected $_label;
	protected $_xmlNode;
	protected $_value = "blank";
	
	function __construct($elementSpec=null) {

	    if (!empty($elementSpec)) {
            if ($elementSpec instanceof \SimpleXMLElement) {
                $this->loadXml($elementSpec);
            } else {
                $this->loadJson($elementSpec);
            }
        }
	}
	
	function __get ($name)
	{
		if ($name == 'label')
			return $this->_label;
		elseif ($name == 'id')
			return $this->_id;
		elseif ($name == 'uid')
			return $this->_uid;
		elseif ($name == 'type')
			return $this->_type;
		else
			return isset($this->_xmlNode->attributes()->$name) ? $this->_xmlNode->attributes()->$name->__toString() : '';
	}
	
	function getXmlAttribute ($name)
	{
		return $this->_xmlNode->attributes()->$name;
	}
	
	public function hasContent ()
	{
		if (!empty($this->_value) && $this->_value != "blank")
			return true;
		else 
			return false;
	}

	public function toJson ()
	{
		return '{"type":"'.$this->_type.'","id":"'.$this->_id.'","uid":"'.$this->_uid.'","label":"'.$this->_label.'","value":"'.$this->_value.'"}';
	}

    public function loadJson($json)
    {
        if (empty($json->type)) {
            echo('Unknown Field Type: ');
            dd($json);
        }
        $this->_type = $json->type;
        $this->_id = $json->id;
        $this->_uid = isset($json->uid) ? $json->uid : $this->_id;
        $this->_label = isset($json->label) ? (string)$json->label : ucfirst((string)$json->id);

        if (isset($json->value)) {
            $this->_value = $json->value;
        }
    }

    /**
     * @param \SimpleXMLElement $XMLNode
     */
    public function loadXml(\SimpleXMLElement $xmlNode): void
    {
        $this->_xmlNode = $xmlNode;

        $this->_type = (string)$xmlNode->getName();
        $this->_id = (string)$xmlNode->attributes()->id;
        $this->_uid = (string)$xmlNode->attributes()->uid;
        $this->_label = isset($xmlNode->attributes()->label) ? (string)$xmlNode->attributes()->label : ucfirst((string)$xmlNode->attributes()->id);
    }
}