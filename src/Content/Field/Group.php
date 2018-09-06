<?php
namespace Sandbox\Cms\Content\Field;

use \Exception;

class Group extends AbstractField implements \SeekableIterator, \Countable, \ArrayAccess
{
	private $_options;
	private $_pointer;
	
	function __construct($elementSpec) {
		parent::__construct ($elementSpec);
	}

    public function loadJson($jsonElement)
    {
        parent::loadJson($jsonElement);

        $this->_options = array ();
        $this->_pointer = 0;

        if ($jsonElement->options ) {
//            foreach ($jsonElement->options as $xmlField) {
//                $id = (string)$xmlField->attributes()->id;
//
//                $this->_options[] = new GroupOption ($xmlField);
//            }

            foreach($jsonElement->options as $id => $elementJson)
            {
                $option =  new GroupOption ($elementJson);
                $this->_options[] = $option;
            }
        }
    }

    public function loadXml(\SimpleXMLElement $XMLNode): void
    {
        parent::loadXml($XMLNode);

        $this->_options = array ();
        $this->_pointer = 0;

        if ($XMLNode->children() ) {
            foreach ($XMLNode->children() as $xmlField) {
                $id = (string)$xmlField->attributes()->id;

                $this->_options[] = new GroupOption ($xmlField);
            }
        }
    }
	
	function __toString()
	{
		return 'Group does not return a string use group[0]';
	}

    function toArray ()
    {
        return $this->_options;
    }

	public function toJson ()
	{
		$jsonElements = array ();
		foreach ($this->_options as $option)
		{
			$j = $option->toJson ();
			array_push($jsonElements,$j);
		}

		return '{"type":"'.$this->_type.'","id":"'.$this->_id.'","uid":"'.$this->_uid.'","label":"'.$this->_label.'","options":['.implode(',',$jsonElements).']}';
	}

    public function rewind()
    {
        $this->_pointer = 0;
        return $this;
    }

    public function current()
    {
        if ($this->valid() === false) {
            return null;
        }

        return $this->_options[$this->_pointer];
    }

    public function key()
    {
        return $this->_pointer;
    }

    public function next()
    {
        ++$this->_pointer;
    }

    public function valid()
    {
        return $this->_pointer < count($this->_options);
    }

    public function count()
    {
        return count($this->_options);
    }

    public function seek($position)
    {
        $position = (int) $position;
        if ($position < 0 || $position >= $this->_count) {
            throw new Zend_Exception("Illegal index $position");
        }
        $this->_pointer = $position;
        return $this;
    }

    public function offsetExists($offset)
    {
        return isset($this->_options[(int) $offset]);
    }

    public function offsetGet($offset)
    {
        $this->_pointer = (int) $offset;

        return $this->current();
    }

	public function hasContent ()
	{
		return $this->count() > 0;
	}

    /**
     * Does nothing
     * Required by the ArrayAccess implementation
     *
     * @param string $offset
     * @param mixed $value
     */
    public function offsetSet($offset, $value)
    {
    }

    /**
     * Does nothing
     * Required by the ArrayAccess implementation
     *
     * @param string $offset
     */
    public function offsetUnset($offset)
    {
    }
}