<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Task;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Task controller.
 *
 * @Route("task")
 */
class TaskController extends Controller
{    
    /**
     * Creates new Task from API.
     *
     * @Route("/api/new", name="task_api_new")
     * @Method({"POST","GET"})
     */
    public function newTaskAction(Request $request)
    {   
        if ($request->request->get('task') != '' && $request->request->get('date') != '') {
            $task = new Task;
            $task->setDescription($request->request->get('task'));
            $task->setCompletionDate(strtotime($request->request->get('date')));
            $task->setCreationDate(time());
            $user = $this->getUser();
            $task->setUser($user);
            $em = $this->getDoctrine()->getManager();
                $em->persist($task);
                $em->flush();
        }
        $allTasks = $this->getDoctrine()->getRepository('AppBundle:Task')->findby(array(
                'user' => $user,
                'done' => 0,
        ), array('completionDate' => 'ASC'));
        echo(json_encode($allTasks));
        return new Response('');
    }
    
    /**
     * Get all Tasks from API.
     *
     * @Route("/api/get/", name="task_api_get")
     * @Method({"POST","GET"})
     */
    public function getTaskAction(Request $request)
    {
        $date = $request->query->get('date');
        $user = $this->getUser();
        $tasks = $this->getDoctrine()->getRepository('AppBundle:Task')->findby(array('user' => $user, 'done' => 0,  'completionDate' => $date), array('completionDate' => 'ASC'));
        echo(json_encode($tasks));
        return new Response('');
    }
    
    
    /**
     * Get all Tasks from API.
     *
     * @Route("/api/getall", name="task_api_get_all ")
     * @Method({"POST","GET"})
     */
    public function getAllTaskAction()
    {
        $user = $this->getUser();
        $tasks = $this->getDoctrine()->getRepository('AppBundle:Task')->findby(array('user' => $user, 'done' => 0), array('completionDate' => 'ASC'));       
        echo(json_encode($tasks));
        return new Response('');
    }
    
    /**
     * Mark task as done from API.
     *
     * @Route("/api/done", name="task_api_done")
     */
    public function doneTaskAction(Request $request)
    {
        parse_str($this->getRequest()->getContent(), $_PUT);
        if (isset($_PUT['id'])){
            $task = $this->getDoctrine()->getRepository('AppBundle:Task')->find($_PUT['id']);
            $task->setDone(true);
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }
        $user = $this->getUser();
        $allTasks = $this->getDoctrine()->getRepository('AppBundle:Task')->findby(array('user' => $user, 'done' => 0), array('completionDate' => 'ASC'));
        echo(json_encode($allTasks));
        return new Response('');
    }
    
    /**
     * Change date of task from API.
     *
     * @Route("/api/changedate", name="task_api_changedate")
     */
        public function changeDateTaskAction(Request $request)
    {
        parse_str($this->getRequest()->getContent(), $_PUT);
        if (isset($_PUT['id']) && isset($_PUT['date']) && $_PUT['date'] != '' ){
            $task = $this->getDoctrine()->getRepository('AppBundle:Task')->find($_PUT['id']);
            $task->setCompletionDate($_PUT['date']);
            $em = $this->getDoctrine()->getManager();
            $em->flush();
        }
        $user = $this->getUser();
        $allTasks = $this->getDoctrine()->getRepository('AppBundle:Task')->findby(array('user' => $user,'done' => 0), array('completionDate' => 'ASC'));
        echo(json_encode($allTasks));
        
        return new Response('');
    }
    
}