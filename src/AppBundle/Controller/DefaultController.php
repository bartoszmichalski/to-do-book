<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $user = $this->getUser();
        if ($user) {
            $token = $user->getToken();
            return $this->render('base.html.twig',  array(
               'token' => $token,
            ));
        } else {
            return $this->redirectToRoute('fos_user_security_login');
        }        
    }
}
