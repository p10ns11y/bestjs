const fn = best.fn();

expect(fn).not.toHaveBeenCalled();

fn();

expect(fn).toHaveBeenCalled();
