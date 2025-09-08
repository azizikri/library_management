<?php

namespace App\Services;

use SoapClient;

class CalculatorService
{
    protected string $wsdl = 'http://www.dneonline.com/calculator.asmx?WSDL';

    public function multiply(int $a, int $b): int
    {
        try {
            $client = new SoapClient($this->wsdl, [
                'trace' => false,
                'exceptions' => true,
            ]);

            // The WSDL expects { intA, intB }
            $result = $client->__soapCall('Multiply', [['intA' => $a, 'intB' => $b]]);

            // Result object typically has MultiplyResult
            return (int) ($result->MultiplyResult ?? 0);
        } catch (\Throwable $e) {
            // Fallback to local multiply if SOAP fails
            return $a * $b;
        }
    }
}

