<?php

class Filter {
	public static function encodeXmlEntities($string, $mode = ENT_NOQUOTES) {
		return (htmlspecialchars($string,  $mode));
	}
}