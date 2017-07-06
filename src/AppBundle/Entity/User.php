<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace AppBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use AppBundle\Entity\Task;

/**
* @ORM\Entity
* @ORM\Table(name="fos_user")
*/
class User extends BaseUser
{
    /**
    * @ORM\Id
    * @ORM\Column(type="integer")
    * @ORM\GeneratedValue(strategy="AUTO")
    */
    protected $id;
    
    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Task", mappedBy="user")
     */
    private $tasks;
    
    /**
     * @var string
     *
     * @ORM\Column(name="token", type="string")
     */
    private $token;

    public function __construct()
    {
        parent::__construct();
        $this->tasks = new ArrayCollection();
        $this->token = substr(str_shuffle("0123456789abcdefghijklmnopqrstvwxyz"), 0, 11);
    }

    /**
     * Add tasks
     *
     * @param \AppBundle\Entity\Task $tasks
     * @return User
     */
    public function addTask(Task $tasks)
    {
        $this->tasks[] = $tasks;

        return $this;
    }

    /**
     * Remove tasks
     *
     * @param \AppBundle\Entity\Task $tasks
     */
    public function removeTask(Task $tasks)
    {
        $this->tasks->removeElement($tasks);
    }

    /**
     * Get tasks
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getTasks()
    {
        return $this->tasks;
    }

    /**
     * Set token
     *
     * @param string $token
     * @return User
     */
    public function setToken($token)
    {
        $this->token = $token;

        return $this;
    }

    /**
     * Get token
     *
     * @return string 
     */
    public function getToken()
    {
        return $this->token;
    }
}
