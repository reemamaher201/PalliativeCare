<?php

namespace Tests;

use Illuminate\Contracts\Console\Kernel;
trait createAppliaction
{
    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
public function createAppliaction(){
    $app = require __DIR__.'/../bootstrap/app.php';
    $app->make(Kernel::class)->bootstrap();
    return $app;
}
}
