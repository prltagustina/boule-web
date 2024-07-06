export default function Button({ children, textOnly, className, ...props }) {
<<<<<<< HEAD
    let cssClasses = textOnly ? 'text-button' : 'button'
    cssClasses += ' ' + className
    return <button className={cssClasses} {...props}>
        {children}
        </button>
}
=======
    let cssClasses = textOnly ? 'text-button' : 'button';
    cssClasses += ' ' + className;
  
    return (
      <button className={cssClasses} {...props}>
        {children}
      </button>
    );
  }
>>>>>>> 5ca97e896659f01ace48d1e53c4f3ae89f4ab6e3
