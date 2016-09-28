<?php

namespace SandboxDigital\Cms;


class CmsContentPlaceholder
{
    var $_name;

    public function __construct($name)
    {
        $this->_name = $name;
    }

    public function __get($name)
    {
        return new Tg_Content_Placeholder ($this->_name.'->'.$name);
    }

    public function __toString()
    {
        $user = Tg_Auth::getAuthenticatedUser();
        if ($user && $user->hasRole('SUPERUSER'))
            return 'Content block doesn\'t exist: '.$this->_name;
        else
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
