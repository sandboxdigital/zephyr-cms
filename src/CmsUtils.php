<?php
/**
 * Created by PhpStorm.
 * User: thomas
 * Date: 7/04/2016
 * Time: 5:23 PM
 */

namespace SandboxDigital\Cms;


class CmsUtils {


	public static function stripWhiteSpace($data)
	{
//		$data=eregi_replace(">"."[[:space:]]+"."<","><",$data);
//		$data=eregi_replace(">"."[[:space:]]+",">",$data);
//		$data=eregi_replace("[[:space:]]+"."<","<",$data);

		$data=str_replace("\t","",$data);
		$data=str_replace("\n","",$data);

		return $data;
	}

	public static function escape ($string) {
		$result = "";
		for ($i = 0; $i < strlen($string); $i++) {
			$result .= self::escapeByCharacter(urlencode($string[$i]));
		}
		return $result;
	}
	
	public static function escapebycharacter($char) {
		if ($char == '+') { return '%20'; }
		if ($char == '%2A') { return '*'; }
		if ($char == '%2B') { return '+'; }
		if ($char == '%2F') { return '/'; }
		if ($char == '%40') { return '@'; }
		if ($char == '%80') { return '%u20AC'; }
		if ($char == '%82') { return '%u201A'; }
		if ($char == '%83') { return '%u0192'; }
		if ($char == '%84') { return '%u201E'; }
		if ($char == '%85') { return '%u2026'; }
		if ($char == '%86') { return '%u2020'; }
		if ($char == '%87') { return '%u2021'; }
		if ($char == '%88') { return '%u02C6'; }
		if ($char == '%89') { return '%u2030'; }
		if ($char == '%8A') { return '%u0160'; }
		if ($char == '%8B') { return '%u2039'; }
		if ($char == '%8C') { return '%u0152'; }
		if ($char == '%8E') { return '%u017D'; }
		if ($char == '%91') { return '%u2018'; }
		if ($char == '%92') { return '%u2019'; }
		if ($char == '%93') { return '%u201C'; }
		if ($char == '%94') { return '%u201D'; }
		if ($char == '%95') { return '%u2022'; }
		if ($char == '%96') { return '%u2013'; }
		if ($char == '%97') { return '%u2014'; }
		if ($char == '%98') { return '%u02DC'; }
		if ($char == '%99') { return '%u2122'; }
		if ($char == '%9A') { return '%u0161'; }
		if ($char == '%9B') { return '%u203A'; }
		if ($char == '%9C') { return '%u0153'; }
		if ($char == '%9E') { return '%u017E'; }
		if ($char == '%9F') { return '%u0178'; }
		return $char;
	}
}