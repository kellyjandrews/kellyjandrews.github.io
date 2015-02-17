---
title: Improving My Workflow
---
Sometimes I wonder how I have missed things.  Bash sripting and the `.bash_(whatever)` files are one of those that I have heard about and never played with... whoops - my bad.  For those of you who are using it and using it effectively, you will probably nod your head when I say - I should have done this years ago.

Never-the-less - here we are. What's a bash script, and what is the `.bash_profile`? Bash is defined on [Wikipedia](http://en.wikipedia.org/wiki/Bash_(Unix_shell)) as " a command processor, typically run in a text window, allowing the user to type commands which cause actions." Ok cool - I can handle that. `.bash_profile` is a shell script that automatically runs when you open terminal.

I code on a Mac, so I'm speaking from that point of view, but most of this should also work on most Linux flavors.

So how do you get started?  First you probably want to just find the `.bash_profile` file, and be able to edit it. Fire up a terminal and type:

{% highlight bash %}
open -e ~/.bash_profile
{% endhighlight %}


Consider this your first bash script.  `open` will open up an application and if you pass in a file name, it will open that as well.

Don't go about just changing things in here quite yet, though. Most of this is added for things to actually work as expected.  The `PATH` item is a list of all the folders your terminal has access to from anywhere.  The folders are seperated by a colon.  You can add folders here, just be sure to not delete any unless you know it's something you don't need. It can wreck your day.

What we are going to do here, is add a line to load up a file that will get created in a bit. At the top of `.bash_profile`, add the following:

{% highlight bash %}
[[ -f ~/.bashrc ]] && source ~/.bashrc
{% endhighlight %}


Now we are starting to get a little crazy. So what is this doing?  The `[[]]` is an if shortcut. So the line is a conditional, and a full list of the flags available are [here](http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html). This particular call uses `-f` and is going to return true if the file exists.  The `&&` is the command to run when the conditional is true. `Source` is a command you run in terminal to add the file in memory so you can use it. You may/may not have a `~/.bashrc` file created. If you do - change the name to something else. Then, create that particular file.

In the file we just created, let's try to add something that will actually perform a task. Open up the `~/.bashrc` and add the following two lines:

{% highlight bash %}
alias bashrc="open -e ~/.bashrc"
alias sb=". ~/.bashrc"
{% endhighlight %}


Save the file, and get back to the command prompt. Now type in `. ~/.bashrc`.  In case of confusion - let me explain what we just did.

Bash allows for a command called `alias` to basically create a short cut.  In our case, we made one that opens our `.bashrc`, and the second sources it.  What is the `source` command?  It's something that runs when you open terminal. I don't always want to close it and open it if I make a change.  So you run the command as either `source` or `.`.  We just did that as well with `sb` for source bash, so our new aliases are available.

Go ahead and type in `bashrc` and start editing. You can add all kinds of great aliases for constant bash commands you are running - like npm or git.  For example I use:

{% highlight bash %}
alias npmsave="npm install $1 --save-dev"
{% endhighlight %}


We have already seen most of this, except for the `$1`.  This is a reference to what you pass in as a parameter to the alias.  Now you need to type `sb` to source your `.bashrc` file.  You may be wondering why we didn't use `source` as the alias.  I tried that, and had a bad day - don't use bash functions as aliases or you will loose your functions.  You can get them back - but I'm not going to tell you how so you don't even try it :)

Once you have sourced your file, go to a folder with a `package.json` file, and type in `npmsave express`.  Boom! New package installed, and saved in your config.

Hopefully after this you can see how great bash commands can make your workflow - they have helped out mine. I wish I had started sooner!
