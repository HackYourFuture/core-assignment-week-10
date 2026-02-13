import { confirm, select } from '@inquirer/prompts';
import chalk from 'chalk';
import promptSync from 'prompt-sync';
import {
  createPost,
  deletePost,
  deleteUser,
  getPosts,
  loginUser,
  registerUser,
  setToken,
  updatePost,
} from './services.js';

const prompt = promptSync();

const promptPassword = (message) => {
  return prompt(message, { echo: '*' }).trim();
};

const registerNewUser = async () => {
  const name = prompt('Enter your name: ').trim();
  if (!name) {
    console.log(chalk.red('Name cannot be empty.'));
    return null;
  }

  const password = promptPassword('Enter a password: ');
  if (!password) {
    console.log(chalk.red('Password cannot be empty.'));
    return null;
  }

  try {
    const data = await registerUser(name, password);
    setToken(data.token);
    console.log(chalk.green(`  User ${name} registered successfully!`));
    return name;
  } catch (error) {
    console.log(chalk.red(error.message));
    return null;
  }
};

const loginExistingUser = async () => {
  const name = prompt('Enter your name: ').trim();
  if (!name) {
    console.log(chalk.red('Name cannot be empty.'));
    return null;
  }

  const password = promptPassword('Enter your password: ');
  if (!password) {
    console.log(chalk.red('Password cannot be empty.'));
    return null;
  }

  try {
    const data = await loginUser(name, password);
    setToken(data.token);
    console.log(chalk.green(`  Welcome back, ${name}!`));
    return name;
  } catch (error) {
    console.log(chalk.red(error.message));
    return null;
  }
};

const chooseAuthAction = async () => {
  console.log(chalk.cyan('\nWelcome to Post Central!'));

  while (true) {
    const choice = await select({
      message: 'What would you like to do?',
      choices: [
        { name: 'Login (existing user)', value: 'login' },
        { name: 'Register (new user)', value: 'register' },
        { name: 'Exit', value: 'exit' },
      ],
    });

    switch (choice) {
      case 'register': {
        const name = await registerNewUser();
        if (name) return name;
        break;
      }
      case 'login': {
        const name = await loginExistingUser();
        if (name) return name;
        break;
      }
      case 'exit':
        console.log(chalk.yellow('Goodbye!'));
        process.exit(0);
    }
  }
};

const viewPosts = async () => {
  const posts = await getPosts();
  console.log(chalk.cyan('\nAll Posts:'));
  if (posts.length === 0) {
    console.log(chalk.gray('  No posts yet. Be the first to post!'));
  } else {
    posts.forEach((post) => {
      console.log(chalk.gray(`  [${post.id}] ${post.user}: ${post.text}`));
    });
  }
};

const createNewPost = async () => {
  const text = prompt('Enter your post: ').trim();
  if (!text) {
    console.log(chalk.red('Message cannot be empty.'));
    return;
  }
  const data = await createPost(text);
  console.log(chalk.green(`  Post created with ID: ${data.id}`));
};

const editPost = async () => {
  await viewPosts();
  const id = parseInt(prompt('Enter post ID to update: ').trim());
  if (isNaN(id)) {
    console.log(chalk.red('Invalid post ID.'));
    return;
  }
  const newText = prompt('Enter new text: ').trim();
  if (!newText) {
    console.log(chalk.red('Text cannot be empty.'));
    return;
  }
  await updatePost(id, newText);
  console.log(chalk.green(`  Post ${id} updated successfully`));
};

const removePost = async () => {
  await viewPosts();
  const id = parseInt(prompt('Enter post ID to delete: ').trim());
  if (isNaN(id)) {
    console.log(chalk.red('Invalid post ID.'));
    return;
  }
  await deletePost(id);
  console.log(chalk.green(`  Post ${id} deleted successfully`));
};

const leaveApp = async () => {
  const confirmed = await confirm({
    message: 'Are you sure you want to delete your account?',
    default: false,
  });
  if (!confirmed) {
    console.log(chalk.blue('Account deletion cancelled.'));
    return;
  }
  await deleteUser();
  console.log(chalk.yellow('Your account has been deleted. Goodbye!'));
  process.exit(0);
};

const exitApp = () => {
  console.log(chalk.yellow('Exiting the post-cli note app. Goodbye!'));
  process.exit(0);
};

const runMainLoop = async () => {
  while (true) {
    const action = await select({
      message: 'What would you like to do?',
      choices: [
        { name: 'Create a new post', value: 'create' },
        { name: 'View my posts', value: 'view' },
        { name: 'Update a post', value: 'update' },
        { name: 'Delete a post', value: 'delete' },
        { name: 'Delete my account', value: 'leave' },
        { name: 'Exit', value: 'exit' },
      ],
    });

    try {
      switch (action) {
        case 'create':
          await createNewPost();
          break;
        case 'view':
          await viewPosts();
          break;
        case 'update':
          await editPost();
          break;
        case 'delete':
          await removePost();
          break;
        case 'leave':
          await leaveApp();
          break;
        case 'exit':
          exitApp();
          break;
      }
    } catch (error) {
      console.log(chalk.red(error.message));
    }
  }
};

const main = async () => {
  try {
    await chooseAuthAction();
    await runMainLoop();
  } catch (error) {
    console.log(chalk.red(error.message));
    process.exit(1);
  }
};

main();
