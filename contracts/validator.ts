declare module '@ioc:Adonis/Core/Validator' {
    interface Rules {
      zip(): Rule,
      phone(): Rule
    }
  }