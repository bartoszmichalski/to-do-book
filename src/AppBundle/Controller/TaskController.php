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
     * Lists all task entities of user.
     *
     * @Route("/", name="task_index")
     * @Method("GET")
     */
    public function indexAction()
    {
        $user = $this->getUser();
        $tasks = $user->getTasks();

        return $this->render('task/index.html.twig', array(
            'tasks' => $tasks,
        ));
    }
    
    /**
     * Lists all task entities for user for Day.
     *
     * @Route("/ForDay/{day}", name="tasks_for_day_index")
     * @Method("GET")
     */
    public function indexTasksForDayAction($day)
    {
        $user = $this->getUser();
        $tasks = $this->getDoctrine()->getRepository('AppBundle:Task')->findBy(array('user'=> $user, 'completionDate' => $day));

        return $this->render('task/index.html.twig', array(
            'tasks' => $tasks,
            'day'=> $day
        ));
    }

    /**
     * Creates a new task entity.
     *
     * @Route("/new", name="task_new")
     * @Method({"GET", "POST"})
     */
    public function newAction(Request $request)
    {
        $task = new Task();
        $task->setUser($this->getUser());
        $task->setCreationDate(time());
        $form = $this->createForm('AppBundle\Form\TaskType', $task);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($task);
            $em->flush();

            return $this->redirectToRoute('task_show', array('id' => $task->getId()));
        }

        return $this->render('task/new.html.twig', array(
            'task' => $task,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a task entity.
     *
     * @Route("/{id}", name="task_show")
     * @Method("GET")
     */
    public function showAction(Task $task)
    {
        $deleteForm = $this->createDeleteForm($task);

        return $this->render('task/show.html.twig', array(
            'task' => $task,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing task entity.
     *
     * @Route("/{id}/edit", name="task_edit")
     * @Method({"GET", "POST"})
     */
    public function editAction(Request $request, Task $task)
    {
        $deleteForm = $this->createDeleteForm($task);
        $editForm = $this->createForm('AppBundle\Form\TaskType', $task);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('task_edit', array('id' => $task->getId()));
        }

        return $this->render('task/edit.html.twig', array(
            'task' => $task,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a task entity.
     *
     * @Route("/{id}", name="task_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, Task $task)
    {
        $form = $this->createDeleteForm($task);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($task);
            $em->flush();
        }

        return $this->redirectToRoute('task_index');
    }

    /**
     * Creates a form to delete a task entity.
     *
     * @param Task $task The task entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Task $task)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('task_delete', array('id' => $task->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
    
    /**
     * Creates new Task from API.
     *
     * @Route("/api/new", name="task_api_new")
     * @Method({"POST","GET"})
     */
    public function newTaskAction(Request $request)
    {
        $task = new Task;
        $task->setDescription($request->request->get('task'));
        $task->setCompletionDate(strtotime($request->request->get('date')));
        $task->setCreationDate(time());
        $user = $this->getDoctrine()->getRepository('AppBundle:User')->find(1);
        $task->setUser($user);
        $em = $this->getDoctrine()->getManager();
            $em->persist($task);
            $em->flush();
        $allTasks = $this->getDoctrine()->getRepository('AppBundle:Task')->findby(array('done' => 0), array('completionDate' => 'ASC'));
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
        $tasks = $this->getDoctrine()->getRepository('AppBundle:Task')->findby(array('done' => 0,  'completionDate' => $date), array('completionDate' => 'ASC'));
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
        $tasks = $this->getDoctrine()->getRepository('AppBundle:Task')->findby(array('done' => 0), array('completionDate' => 'ASC'));       
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
        $allTasks = $this->getDoctrine()->getRepository('AppBundle:Task')->findby(array('done' => 0), array('completionDate' => 'ASC'));
        echo(json_encode($allTasks));
        return new Response('');
    }
    
    /**
     * Mark task as done from API.
     *
     * @Route("/api/changedate", name="task_api_changedate")
     */
        public function changeDateTaskAction(Request $request)
    {
        parse_str($this->getRequest()->getContent(), $_PUT);
        if (isset($_PUT['id']) && isset($_PUT['date'])){
            $task = $this->getDoctrine()->getRepository('AppBundle:Task')->find($_PUT['id']);
            $task->setCompletionDate(strtotime($_PUT['date']));
            $em = $this->getDoctrine()->getManager();
                $em->flush();
        }
        $allTasks = $this->getDoctrine()->getRepository('AppBundle:Task')->findby(array('done' => 0), array('completionDate' => 'ASC'));
        echo(json_encode($allTasks));
        return new Response('');
    }
}